# Google Drive Sharing Audit

Scans folders and files in a user's Google Drive for sharing settings and stores the information in a spreadsheet.

## Installation

>Hosting this app shouldn't use up the hosting account's quota. Instead, the executing account's quota should be used.

1. Log in with the Google account you want to use to host the app. Which account you choose doesn't matter much, as long as it can be used to host Google Apps Script web applications.
2. Proceed to [Google Drive](https://drive.google.com/drive/), and create a new "Google Apps Script" from the file-creation menu.
3. In the "Google Apps Script" online IDE, create new "Script" and "HTML" files with the same names and contents as the source files from this repository.
4. Customize any settings if you want to.
5. Select "Deploy as web app..." from the "Publish" menu. Publish your project with the following settings:
    - If the hosting Google account will be the only user:
        | Field | Value |
        | --- | --- |
        | Execute the app as | User accessing the web app |
        | Who has access to the app | Only myself |
    - If another Google account will use the app:
        | Field | Value |
        | --- | --- |
        | Execute the app as | User accessing the web app |
        | Who has access to the app | Anyone |
6. Remember the web app's URL, which you can visit to use the app

## Usage

1. Navigate to the web app's URL.
2. Authorize the app with the Google account whose Google Drive you wish to scan for sharing permissions.
3. Click the "Start" button to begin scanning the authorized Google account's Google Drive.
4. If you want to pause (usually valid for around a week) or abort execution, click the "Pause" button and wait for the button's text to display "Resume", signalling the script has paused execution and may be closed (state will not persist).
