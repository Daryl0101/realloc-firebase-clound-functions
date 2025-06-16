# ReAlloc Firebase Functions

Firebase Cloud Functions for push notifications in the ReAlloc Food Allocation Management System.

[Click to hop to Backend](https://github.com/Daryl0101/realloc-be)

## Overview

Automatically sends Firebase Cloud Messaging (FCM) push notifications to users when new notifications are created in Firestore.

## Features

- **Auto-triggered notifications** when documents are created in `/notifications/{id}`
- **Multi-device support** sends to all user's registered FCM tokens
- **Error handling** for missing users or invalid tokens

## Setup

### Prerequisites
- Node.js 18+
- Firebase CLI
- Firebase project with Firestore and FCM enabled

### Installation
```bash
firebase init functions
cd functions
npm install
```

### Database Structure

**Notifications** (`/notifications/{notificationId}`)
```typescript
{
  id: string;
  user_id: string;
  title: string;
  body: string;
  link: string | null;
  status: string;
}
```

**Users** (`/users/{userId}`)
```typescript
{
  tokens: string[];  // FCM device tokens
}
```

## Function: `sendnotification`

**Trigger**: New document in `/notifications/{notificationId}`

**Process**:
1. Validates notification data
2. Fetches target user from Firestore
3. Checks for valid FCM tokens
4. Sends push notification to all user devices

## Deployment

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendnotification
```

## Local Development

```bash
# Start emulators
firebase emulators:start --only functions,firestore
```

## Monitoring

View logs and metrics in Firebase Console:
- Functions dashboard for execution stats
- Logs Explorer for detailed function logs

Built for the ReAlloc food allocation system to keep users informed of important updates.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
