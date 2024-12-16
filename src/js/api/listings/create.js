import { API_AUCTION_LISTINGS } from "../../api/constants.js";
import { headers } from "../../api/headers.js";

export async function createListing({
  title,
  description,
  tags,
  media,
  endsAt,
}) {
  const payload = {
    title,
    description,
    endsAt,
  };

  if (tags && tags.length > 0) {
    payload.tags = tags;
  }

  if (media && media.length > 0) {
    payload.media = media.map((url) => ({ url }));
  }

  const response = await fetch(API_AUCTION_LISTINGS, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || "Failed to create listing"
    );
  }

  const { data } = await response.json();
  return data;
}
