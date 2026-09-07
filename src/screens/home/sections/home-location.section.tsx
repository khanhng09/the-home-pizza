import { HomeLocationSwitcher } from '../components/home-location-switcher';
import { HomeIllustrationLayer } from '../components/home-illustration-layer';

export function HomeLocationSection() {
  return (
    // `relative` so the illustration layer measures against the section, the
    // box the design places these against — the switcher nests its copy in a
    // half-width panel that starts somewhere else.
    <section
      aria-labelledby="home-location-heading"
      className="section-anchor section-screen relative flex flex-col overflow-hidden bg-ink"
    >
      <HomeLocationSwitcher />
      <HomeIllustrationLayer section="location" />
    </section>
  );
}
