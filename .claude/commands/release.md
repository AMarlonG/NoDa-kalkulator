Guide me through releasing changes to production. Follow these steps:

## 1. Check Status
Run `git status` to see ALL modified and untracked files. List them clearly.

## 2. Review Changes
For each modified file, briefly describe what changed. Do NOT skip any files.

## 3. Stage Files
Ask me which files to include. Default to ALL modified tracked files unless I specify otherwise.
Use `git add -u` to stage all modified tracked files, or `git add <specific files>` if I request.

## 4. Commit
Create a clear commit message following the project's convention (type: description).
Show me the commit message before committing.

## 5. Push
Push to the main branch: `git push origin main`

## 6. Verify Deployment
Confirm the push succeeded and remind me that Vercel will auto-deploy within 1-3 minutes.
Tell me to hard-refresh (Cmd+Shift+R) if the changes don't appear.

IMPORTANT: Never skip files without explicitly asking. The goal is to deploy ALL intended changes.
