/* Three tabs, and all three are REAL PAGES rather than hash anchors into the
   landing page: /products, /about and /contact each have their own route in
   App.jsx and their own component under src/pages/.

   That matters for the header, which renders `route: true` entries as react-
   router <Link>s and everything else as plain hash anchors. A hash link only
   works while you are already on the landing page — from /contact, "#nutrition"
   resolves against the current URL, scrolls nowhere and leaves a stale hash in
   the bar. With every entry a route, the nav works identically from any page.

   Contact Us used to be hardcoded in ActiproHeader.jsx, separately from this
   list, because it was the only route among hash links. It belongs here now
   that all three are the same kind of thing — the header renders the list and
   nothing else, so adding or reordering a tab is a change to this file alone.

   The previous list carried Nutrition and How It's Made, which pointed at
   #nutrition and #process. Both of those sections are currently unmounted from
   ActiproSite.jsx, so the links scrolled nowhere; dropping them is what the
   three-tab bar fixes as well as simplifies. */
export const NAV_LINKS = [
  { label: 'Products', href: '/products', route: true },
  { label: 'About Us', href: '/about', route: true },
  { label: 'Contact Us', href: '/contact', route: true },
]
