# MongoDB Fix TODO

- [x] Understand the issue: MongoDB Atlas IP whitelist blocking connection
- [x] Remove in-memory MongoDB fallback
- [x] Update database.js for direct MongoDB Atlas connection
- [x] Update server/index.js to use database.js helper
- [x] Update server/seed/seed.js to use database.js helper
- [x] Create .env.example with Atlas connection template
- [x] Add helpful error messages for connection issues

**Status: ✅ CONNECT TO YOUR ATLAS DB**

## What You Need To Do:

1. Go to https://cloud.mongodb.com (MongoDB Atlas)
2. Create a cluster (or use existing)
3. Go to **Database Access** → Add New Database User → create username + password
4. Go to **Network Access** → Add IP Address → `0.0.0.0/0` (allow from anywhere) or your specific IP
5. Go to **Database** → **Connect** → **Drivers** → **Node.js** → Copy the connection string
6. Open `placement-tracker/server/.env` and paste:
   ```
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/placement_tracker?retryWrites=true&w=majority
   ```
7. Run `npm run dev` in the server folder

## Common Errors (now with helpful messages):
- **IP not whitelisted** → follow step 4 above
- **Bad auth** → check username/password (use Database user, not Atlas account!)
- **Cannot reach cluster** → check internet and cluster name

