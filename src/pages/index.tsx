import Header from '@/components/header';
import Approve from '@/components/approve';
import Staking from '@/components/staking';
import Other from '@/components/other';
import Deploy from '@/components/deploy';
import Info from '@/components/info';

export default function IndexPage() {
  return (
    <div>
      <Header></Header>
      <Approve></Approve>
      <Staking></Staking>
      <Other></Other>
      <Deploy></Deploy>
      <Info></Info>
    </div>
  );
}
