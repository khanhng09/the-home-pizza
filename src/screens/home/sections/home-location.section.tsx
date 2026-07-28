import { HomeLocationSwitcher } from '../components/home-location-switcher';

export function HomeLocationSection() {
  return (
    <section aria-labelledby="home-location-heading" className="overflow-hidden bg-ink">
      <HomeLocationSwitcher />
    </section>
  );
}
