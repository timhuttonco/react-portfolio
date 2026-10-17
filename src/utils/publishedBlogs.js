// Returns only the posts whose date is today or earlier (in the visitor's local time).
// Posts dated in the future are hidden from the lists but still load via their direct link,
// which lets posts be "scheduled" by setting a future date in src/data/allBlogs.js.
export function filterPublished(blogs, now = new Date()) {
  return blogs.filter((blog) => {
    const published = new Date(blog.date); // e.g. "October 16, 2026" -> local midnight
    // If the date can't be parsed, show the post rather than silently hiding it
    return isNaN(published.getTime()) || published <= now;
  });
}
