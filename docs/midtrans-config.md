# Midtrans Configuration Guide

## Overview

This application supports both Midtrans Sandbox and Production environments. The configuration is controlled by environment variables, allowing you to switch between environments without code changes.

## Environment Variables

### Backend Configuration

| Variable                 | Description                 | Sandbox Example                          | Production Example                    |
| ------------------------ | --------------------------- | ---------------------------------------- | ------------------------------------- |
| `MIDTRANS_SERVER_KEY`    | Server key for Midtrans API | `SB-Mid-server-xxxxxxxxxxxxxxxx`         | `Mid-server-xxxxxxxxxxxxxxxx`         |
| `MIDTRANS_CLIENT_KEY`    | Client key for frontend     | `SB-Mid-client-xxxxxxxxxxxxxxxx`         | `Mid-client-xxxxxxxxxxxxxxxx`         |
| `MIDTRANS_MERCHANT_ID`   | Merchant ID                 | `Gxxxxxxxxx`                             | `Gxxxxxxxxx`                          |
| `MIDTRANS_IS_PRODUCTION` | Environment flag            | `false`                                  | `true`                                |

### Frontend Configuration

| Variable                      | Description             | Sandbox Example                  | Production Example            |
| ----------------------------- | ----------------------- | -------------------------------- | ----------------------------- |
| `VITE_MIDTRANS_CLIENT_KEY`    | Client key for frontend | `SB-Mid-client-xxxxxxxxxxxxxxxx` | `Mid-client-xxxxxxxxxxxxxxxx` |
| `VITE_MIDTRANS_IS_PRODUCTION` | Environment flag        | `false`                          | `true`                        |

## Configuration Examples

### Sandbox Environment (.env)

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=Gxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Frontend Environment Variables (Vite)
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
VITE_MIDTRANS_IS_PRODUCTION=false
```

### Production Environment (.env)

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=Gxxxxxxxxx
MIDTRANS_IS_PRODUCTION=true

# Frontend Environment Variables (Vite)
VITE_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxx
VITE_MIDTRANS_IS_PRODUCTION=true
```

## API Endpoints

The application automatically uses the correct API endpoints based on the `MIDTRANS_IS_PRODUCTION` setting:

### Sandbox Environment

- **API Host**: `https://api.sandbox.midtrans.com`
- **Snap Host**: `https://app.sandbox.midtrans.com`
- **Redirect URLs**: `https://app.sandbox.midtrans.com/snap/v4/redirection/...`

### Production Environment

- **API Host**: `https://api.midtrans.com`
- **Snap Host**: `https://app.midtrans.com`
- **Redirect URLs**: `https://app.midtrans.com/snap/v4/redirection/...`

## Dynamic Script Loading

The application now uses dynamic script loading instead of hardcoded scripts in `index.html`. This ensures that:

1. **Environment-specific URLs**: Script loads from the correct environment (sandbox/production)
2. **Dynamic Client Keys**: Client key is set based on environment variables
3. **Better Error Handling**: Proper error handling for script loading failures
4. **Pre-loading**: Script is pre-loaded when the donation component mounts

### How It Works

1. **Pre-loading**: When the donation component mounts, it automatically loads the appropriate Midtrans script
2. **Environment Detection**: Script URL and client key are determined by `VITE_MIDTRANS_IS_PRODUCTION`
3. **Fallback Loading**: If pre-loading fails, script is loaded on-demand when user clicks donate
4. **Error Handling**: Proper error messages if script fails to load

### Files Involved

- `src/lib/midtrans-loader.ts` - Dynamic script loading utility
- `src/components/Donate.tsx` - Updated to use dynamic loading
- `index.html` - Removed hardcoded script (now dynamic)

## Key Differences

### Server Keys

- **Sandbox**: Start with `SB-` prefix
- **Production**: Start with `Mid-` prefix

### Client Keys

- **Sandbox**: Start with `SB-` prefix
- **Production**: Start with `Mid-` prefix

### Merchant IDs

- **Sandbox**: Different merchant ID for testing
- **Production**: Real merchant ID for live transactions

## Important Notes

1. **Environment Consistency**: Both frontend and backend must use the same environment setting (`MIDTRANS_IS_PRODUCTION` and `VITE_MIDTRANS_IS_PRODUCTION`).

2. **Key Matching**: The client key in frontend (`VITE_MIDTRANS_CLIENT_KEY`) must match the backend (`MIDTRANS_CLIENT_KEY`).

3. **Testing**: Always test with sandbox environment first before switching to production.

4. **Security**: Never commit real production keys to version control. Use environment variables and keep them secure.

5. **Script Loading**: The Midtrans script is now loaded dynamically, so ensure environment variables are properly set.

## Troubleshooting

### Common Issues

1. **Wrong Redirect URL**: If you're getting production URLs while using sandbox keys, check that `MIDTRANS_IS_PRODUCTION` is set to `false`.

2. **Frontend-Backend Mismatch**: Ensure both `MIDTRANS_IS_PRODUCTION` and `VITE_MIDTRANS_IS_PRODUCTION` are set to the same value.

3. **Key Mismatch**: Verify that the client keys match between frontend and backend configurations.

4. **Script Loading Issues**: Check browser console for script loading errors. Ensure environment variables are properly set.

### Verification Steps

1. Check environment variables are loaded correctly
2. Verify the `isProduction` flag in both frontend and backend
3. Test transaction creation and verify redirect URLs
4. Monitor server logs for Midtrans API calls
5. Check browser console for script loading messages
6. Verify that the correct script URL is being loaded based on environment
