export async function getSharedConfig(name: string) {
  const res = await fetch(`https://shared-configs.elydore.com?name=${name}`, {
    method: "GET",
    headers: {
      Authorization: process.env.SHARED_CONFIG_API_TOKEN,
    },
  });

  const data = await res.json();
  return data?.value;
}
