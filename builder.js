#!/usr/bin/env node
// reference from https://github.com/PromiseAll/pkg-exe-build

const {need} = require('pkg-fetch');
const {exec} = require('pkg');
import ResEdit from 'resedit';
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

// command line arguments
let version = packageJson.version + '.0';
let commit_id = '';
const args = process.argv
  .slice(2)
  .map(arg => arg.split(':'))
  .reduce((args, [value, key]) => {
    args[value] = key;
    return args;
  }, {});
if (args.version) {
  if(args.version.split('.').length < 4) {
    version = args.version + '.0';
    // console.error("Version argument must have 4 components");    
    // process.exit(1);
  } else {
    version = args.version;
  }
}
if (args.commit_id) {
  if(args.commit_id.length != 8 || !(/^[A-F0-9]+$/i.test(args.commit_id))) {
    console.error("Invalid commit id supplied, it must be 8 digit hexadecimal value.");    
    process.exit(1);
  } else {
    commit_id = '-' + args.commit_id;
  }
}

//
const builder_config = {
  name: 'Mavis API service',
  icon: 'app.ico',
  entry_file: packageJson.main,
  description: packageJson.description,
  company: 'Aquacodes Pvt. Ltd.',
  file_version: version,
  product_version: version,
  copyright: '© 2022-2023 Aquacodes Pvt. Ltd. All rights reserved.',
};

//
async function build() {
  const targets = packageJson.pkg.targets[0].split('-');

  console.log('> Download Binaries');
  let fetchedPath = await need({
    nodeRange: targets[0],
    platform: targets[1],
    arch: targets[2],
    forceBuild: false,
    forceFetch: true,
    dryRun: false,
    // output: 'test'
  });

  // working on exe
  console.log('> Read EXE');
  let data = fs.readFileSync(fetchedPath);
  let exe = ResEdit.NtExecutable.from(data);
  let res = ResEdit.NtExecutableResource.from(exe);
  let viList = ResEdit.Resource.VersionInfo.fromEntries(res.entries);
  let vi = viList[0];

  const file_version = builder_config.file_version.split('.');

  // vi.removeStringValue({lang: 1033, codepage: 1200}, 'OriginalFilename');
  // vi.removeStringValue({lang: 1033, codepage: 1200}, 'InternalName');
  vi.setStringValue(
    {lang: 1033, codepage: 1200},
    'OriginalFilename',
    'sb-console-service.exe'
  );
  vi.setStringValue({lang: 1033, codepage: 1200}, 'InternalName', 'Snowbird');

  console.log('> Setting File Version');
  vi.setFileVersion(
    file_version[0],
    file_version[1],
    file_version[2],
    file_version[3],
    1033
  );

  console.log('> Setting File Info');
  vi.setStringValues(
    {lang: 1033, codepage: 1200},
    {
      FileDescription: builder_config.description,
      ProductName: builder_config.name,
      ProductVersion: builder_config.product_version + commit_id,
      CompanyName: builder_config.company,
      LegalCopyright: builder_config.copyright,
    }
  );

  vi.outputToResourceEntries(res.entries);

  console.log('> Setting Icon');
  let iconFile = ResEdit.Data.IconFile.from(
    fs.readFileSync(path.join(process.cwd(), builder_config.icon))
  );
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    1033,
    iconFile.icons.map(item => item.data)
  );
  res.outputResource(exe);

  console.log('> Generating EXE');
  let newBinary = exe.generate();

  console.log('> Saving modified EXE');
  const builtPath = fetchedPath.replace('fetched', 'built');
  fs.writeFileSync(builtPath, Buffer.from(newBinary));

  console.log('> Bundling App');
  await exec([
    '--build',
    '--config',
    'packageJson.json',
    `${builder_config.entry_file}`,
  ]);
}

build();
