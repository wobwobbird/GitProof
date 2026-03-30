/** Disables submit until the URL is more than the default github.com prefix (owner/repo). */
export function isGithubRepoIncomplete(url: string): boolean {
  const trimmed = url.trim();
  if (/^https:\/\/github\.com\/?$/i.test(trimmed)) {
    return true;
  }
  const match = /^https:\/\/github\.com\/(.+)$/i.exec(trimmed);
  if (!match) {
    return false;
  }
  const pathPart = match[1].replace(/\/+$/, "");
  return pathPart === "" || !pathPart.includes("/");
}
