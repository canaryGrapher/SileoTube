# Privacy Policy for SileoTube

**Effective Date:** October 2025  
**Last Updated:** October 2025

## Introduction

SileoTube ("we," "our," or "the extension") is a browser extension designed to help users maintain focus while using YouTube by removing distracting elements such as recommendations, Shorts, comments, and sidebars. This Privacy Policy explains how we handle your information when you use SileoTube.

## Our Commitment to Privacy

SileoTube is built with privacy as a core principle. We do not collect, track, store, or transmit any personally identifiable information (PII) or browsing data. All processing occurs locally on your device.

## Information We Do NOT Collect

SileoTube does **not** collect, store, or transmit:
- Personal information (name, email address, phone number, etc.)
- Browsing history
- YouTube watch history
- Search queries
- Video viewing preferences
- Device information
- Location data
- Usage analytics or telemetry
- Any other personal or identifying information

## Information Stored Locally

SileoTube stores the following information **only on your device** using your browser's local storage:

- **Extension Settings**: Your preferences for which distractions to hide:
  - Homepage focus mode (enabled/disabled)
  - Shorts page blocking (enabled/disabled)
  - Watch page focus mode (enabled/disabled)
  - Comments visibility (enabled/disabled)
  - Sidebar visibility (enabled/disabled)
  - Shorts recommendations visibility (enabled/disabled)

This information is stored locally using the browser's `storage.local` API and **never leaves your device**. These settings are used solely to maintain your preferences between browser sessions and apply your chosen focus modes when you visit YouTube.

## Permissions Used

SileoTube requires the following permissions to function:

### Storage Permission
- **Purpose**: To save your extension settings locally on your device
- **Data**: Only your toggle preferences (on/off states) are stored
- **Location**: Data remains on your device and is never transmitted

### Tabs Permission
- **Purpose**: To apply your settings across all open YouTube tabs simultaneously when you change preferences
- **Data**: No browsing data is accessed or stored; only used to send messages to YouTube tabs to apply your settings

### Host Permissions (YouTube)
- **Purpose**: To inject content scripts only on YouTube pages (`*://*.youtube.com/*`)
- **Scope**: Limited exclusively to YouTube domains and subdomains
- **Function**: Modifies the YouTube page layout to hide distracting elements based on your preferences

## External Connections

SileoTube makes minimal external connections only for the following purposes:

### Image Loading (ImageKit CDN)
- **Service**: ImageKit.io (`ik.imagekit.io`)
- **Purpose**: Loads background images shown on the homepage and Shorts blocking page
- **Data**: No personal information is sent; only requests for public image assets
- **Privacy**: ImageKit may log standard HTTP request metadata (IP address, user agent) as part of normal CDN operations. We do not control ImageKit's privacy practices, but these requests contain no personal identifying information beyond standard web request data.

### Installation Redirect (Optional)
- **Service**: Worvar.com (`workvar.com`)
- **Purpose**: On first installation, opens a welcome/product page in a new tab
- **Timing**: Only occurs once when the extension is first installed
- **Data**: No data is sent; this is a standard browser redirect

### Uninstall Survey (Optional)
- **Service**: Worvar.com (`workvar.com`)
- **Purpose**: Opens an optional feedback survey page when the extension is uninstalled
- **Timing**: Only occurs when the extension is removed
- **Data**: No data is sent; this is a standard browser redirect

## Data Sharing

SileoTube does **not** share, sell, rent, or disclose any information to third parties, including:
- Analytics services
- Advertising networks
- Data brokers
- Social media platforms
- Any other third-party services

## Data Security

Since all data is stored locally on your device:
- Your settings are protected by your browser's built-in security
- Data is encrypted at rest by your browser (if your browser supports it)
- No data transmission means no risk of interception during transfer
- You can delete all extension data at any time by uninstalling the extension or clearing browser storage

## Your Rights and Choices

You have complete control over your data:

- **View Settings**: Access your stored preferences through the extension popup
- **Modify Settings**: Change your preferences at any time through the extension interface
- **Delete Data**: Uninstall the extension to remove all stored settings, or manually clear browser storage
- **No Tracking**: Since we don't collect data, there's nothing to opt out of

## Children's Privacy

SileoTube does not knowingly collect information from children. Since we do not collect any personal information, this extension is safe for users of all ages.

## Changes to This Policy

If we make changes to this Privacy Policy, we will:
- Update the "Last Updated" date at the top of this document
- Update the version if substantial changes are made
- Maintain the same privacy-first principles

## Compliance

This Privacy Policy complies with:
- Chrome Web Store Developer Program Policies
- Firefox Add-on Policies
- General Data Protection Regulation (GDPR) principles (though we don't collect data, we follow privacy-by-design)
- California Consumer Privacy Act (CCPA) principles

## Contact

For questions about this Privacy Policy or SileoTube's privacy practices, please visit:
https://worvar.com/sileotube/privacy

## Summary

**In short**: SileoTube stores your preferences locally on your device and does nothing else. No tracking, no analytics, no data collection, no external data transmission. Your privacy is protected by design.

---

By using SileoTube, you acknowledge that you have read and understood this Privacy Policy. Since we don't collect any data, your continued use of the extension indicates your acceptance of how we handle your information (which is: we don't handle it at all).

