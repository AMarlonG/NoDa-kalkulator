Guide me through releasing changes to production. Follow these steps:

## CRITICAL RULE
DO NOT be selective about which files to commit. The .gitignore file handles what should be excluded. Trust it. Commit EVERYTHING that git status shows as modified or untracked (unless it's in .gitignore). Being "careful" by excluding files causes more problems than it solves.

## 1. Check Status
Run `git status` to see ALL modified and untracked files. List them clearly.

## 2. Review Changes
For each modified file, briefly describe what changed. Do NOT skip any files.

## 3. Stage ALL Files
Stage everything: `git add -A` (adds all modified, deleted, and new files)
Only exclude files if the user explicitly requests it.

## 4. Commit
Create a clear commit message following the project's convention (type: description).
Show me the commit message before committing.

## 5. Push
Push to the main branch: `git push origin main`

## 6. Verify Deployment
Confirm the push succeeded and remind me that Vercel will auto-deploy within 1-3 minutes.
Tell me to hard-refresh (Cmd+Shift+R) if the changes don't appear.

## 7. Final Check
Run `git status` again to confirm working directory is clean. If there are still uncommitted files, GO BACK TO STEP 3.
