interface RecommendFeed {
  id: string;
  type: string;
  offset: number;
  target: {
    id: number;
    answer_type: string;
    excerpt: string;
    updated_time: number;
    type: string;
    title?: string;
    question: {
      id: number;
      title: string;
    };
  };
}

interface RecommendResponse {
  data: RecommendFeed[];
  fresh_text: string;
  paging: {
    is_start: boolean;
    is_end: boolean;
    next: string;
    previous: string;
    totals: number;
  };
}

async function fetchFeeds(url: string) {
  const items: FeedItem[] = [];
  let next = "";

  try {
    const res = await fetch(url);
    const json = (await res.json()) as unknown as RecommendResponse;
    next = json.paging.next;

    if (Array.isArray(json?.data)) {
      (json.data || []).forEach((item) => {
        const { target } = item;
        if (target.type === "answer") {
          const answerUrl = `https://www.zhihu.com/question/${target.question.id}/answer/${target.id}`;
          items.push({
            title: target.question.title,
            link: answerUrl,
            date: new Date(target.updated_time * 1000),
            description: target.excerpt,
          });
        }
        if (target.type === "article") {
          const articleUrl = `https://zhuanlan.zhihu.com/p/${target.id}`;
          items.push({
            title: target.title,
            link: articleUrl,
            date: new Date(target.updated_time * 1000),
            description: target.excerpt,
          });
        }
      });
    }
  } catch (e) {
    //
  }

  return {
    items,
    next,
  };
}

export default defineEventHandler(async () => {
  const sessionToken = await getSharedConfig("www.zhihu.com_session_token");
  const searchParams = new URLSearchParams({
    action: "down",
    desktop: "true",
    page_number: "1",
    session_token: sessionToken,
  });

  const url = `https://www.zhihu.com/api/v3/feed/topstory/recommend?${searchParams.toString()}`;
  const { items, next } = await fetchFeeds(url);
  const { items: nextItems } = await fetchFeeds(next);

  return createXMLFeed({
    title: "知乎推荐",
    description: "知乎首页推荐",
    image: "https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png",
    link: "https://www.zhihu.com/",
    favicon: "https://static.zhihu.com/heifetz/favicon.ico",
    items: [...items, ...nextItems],
  });
});
