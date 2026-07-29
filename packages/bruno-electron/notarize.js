require('dotenv').config({ path: process.env.DOTENV_PATH });
const fs = require('fs');
const path = require('path');
const { notarize } = require('@electron/notarize');

module.exports = async function (params) {
  if (process.platform !== 'darwin') return;

  const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    console.error(`Cannot find application at: ${appPath}`);
    return;
  }

  const { APPLE_ID, APPLE_ID_PASSWORD, APPLE_TEAM_ID } = process.env;
  if (!APPLE_ID || !APPLE_ID_PASSWORD || !APPLE_TEAM_ID) {
    console.warn('Skipping notarization: APPLE_ID / APPLE_ID_PASSWORD / APPLE_TEAM_ID are not all set.');
    return;
  }

  console.log(`Notarizing ${appPath} as ${APPLE_ID} (team ${APPLE_TEAM_ID})`);
  await notarize({
    tool: 'notarytool',
    appPath,
    appleId: APPLE_ID,
    appleIdPassword: APPLE_ID_PASSWORD,
    teamId: APPLE_TEAM_ID
  });
  console.log('Done notarizing');
};
