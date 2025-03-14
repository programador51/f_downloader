export interface IntesectionPostsParam {
  onIntersection: (item:IntersectionObserverEntry) => void
  onDisintersection: () => void
}
