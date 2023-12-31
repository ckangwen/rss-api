import { Feed } from "feed";

export interface FeedItem {
  title: string;
  id?: string;
  link: string;
  date: Date;
  description?: string;
  content?: string;
  image?: string;
}

interface FeedOptions {
  title: string;
  description: string;
  link: string;
  image: string;
  items: FeedItem[];
  favicon?: string;
}

function createFeed(options: FeedOptions) {
  const { title, description, link, image, items, favicon } = options;
  const feed = new Feed({
    title,
    description,
    id: link,
    link,
    image,
    favicon,

    language: "zh-CN",
    copyright: "elydore.me@gmail.com",
    generator: "https://github.com/jpmonette/feed",
    author: {
      name: "Kevin Taso",
      email: "elydore.me@gmail.com",
      link: "https://github.com/ckangwen",
    },
  });

  items.forEach((item) => {
    feed.addItem({
      title: item.title,
      id: item.id,
      link: item.link,
      date: item.date,
      description: item.description,
      content: item.content,
      image: item.image,
    });
  });

  return feed.rss2();
}

export function createXMLFeed(options: FeedOptions) {
  const xml = createFeed(options);
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=UTF-8",
    },
  });
}
