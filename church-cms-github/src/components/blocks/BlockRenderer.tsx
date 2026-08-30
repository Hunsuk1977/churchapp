import type { Announcement, PageBlock } from "@/lib/types";
import { HeroBanner } from "./HeroBanner";
import { YoutubeRecent } from "./YoutubeRecent";
import { GooglePhotosAlbum } from "./GooglePhotosAlbum";
import { AnnouncementsBoard } from "./AnnouncementsBoard";
import { ServiceTimes } from "./ServiceTimes";

export function BlockRenderer({
  block,
  churchSlug,
  announcements,
}: {
  block: PageBlock;
  churchSlug: string;
  announcements: Announcement[];
}) {
  switch (block.typeKey) {
    case "hero_banner":
      return <HeroBanner block={block} churchSlug={churchSlug} />;
    case "youtube_recent":
      return <YoutubeRecent block={block} />;
    case "google_photos_album":
      return <GooglePhotosAlbum block={block} />;
    case "announcements_board":
      return <AnnouncementsBoard block={block} announcements={announcements} />;
    case "service_times":
      return <ServiceTimes block={block} />;
    default:
      return null;
  }
}
