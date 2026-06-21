export default async function sitemap() {
  const baseUrl = "https://emiramotors.com";
  
  const services = [
    "periyodik-bakim",
    "agir-bakim",
    "motor-revizyonu",
    "kaynak-isciligi",
    "fren-suspansiyon",
    "elektrik-arizalari",
    "lastik-jant"
  ];
  
  const serviceUrls = services.map(slug => ({
    url: `${baseUrl}/hizmetler/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  const staticUrls = [
    "",
    "/hizmetler",
    "/sigorta-hasar",
    "/kurumsal-filo",
    "/galeri",
    "/hakkimizda",
    "/iletisim",
    "/bakim-hesaplayici",
    "/blog"
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === "" ? 1.0 : 0.8,
  }));
  
  return [...staticUrls, ...serviceUrls];
}
