WSET LEVEL 2 QUIZ TRAINER — 1,000 QUESTION ADAPTIVE UPDATE

UPLOAD THESE FILES TO THE ROOT OF YOUR EXISTING WSet2 GITHUB REPOSITORY:
- index.html
- app.js
- questions.js   <-- NEW
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png

WHAT CHANGED
- 1,000-question practice bank
- Adaptive repetition: wrong answers become much more likely to return; repeated correct answers become much less likely
- 50-question mock exam uses the WSET Level 2 syllabus weighting: 5 vineyard, 4 winemaking, 19 principal varieties, 12 regional varieties, 6 sparkling/fortified, 4 service/storage/food
- Progress persists on the device using localStorage
- Offline/Home Screen support retained

GITHUB UPDATE STEPS
1. Open your existing WSet2 repository.
2. Click Add file > Upload files.
3. Drag ALL SEVEN app files from this folder into the upload area.
4. GitHub will show that several filenames already exist. That is expected: uploading and committing them replaces the old versions.
5. Confirm that questions.js is included. It did not exist in the old build.
6. Scroll to Commit changes.
7. Commit message: Update to 1000-question adaptive quiz
8. Click Commit changes.
9. Wait about 1-3 minutes for GitHub Pages to redeploy.
10. Open your existing GitHub Pages URL.

IF YOUR IPHONE STILL SHOWS THE OLD VERSION
- Open the site once in Safari and refresh.
- Close and reopen the Home Screen app.
- The service worker cache name changed to wset2-v4, so the new version should replace the old cached app after reload.

NOTE
These are original practice questions written to align with WSET Level 2 topics and multiple-choice style. They are not official WSET questions or past-paper questions.
