export function convertGoogleDriveUrlToThumbnail(url: string): string {
  const driveFileIdPattern = /^https:\/\/drive\.google\.com\/(?:.*\/)?file\/d\/([a-zA-Z0-9_-]+)\//;
  const match = url.match(driveFileIdPattern);

  if (match && match[1]) {
    const fileId = match[1];
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&export=view&sz=w5000';
  }

  return url;
}