import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';
import Colors from '../common/Colors';

const SectionLayout = styled.section(({ meta }) => ({
  ...tw`pt-8 px-5 mb-16`,
  backgroundColor: Colors[meta.color].HomepagePromoBackground,
  color: Colors[meta.color].HomepagePromoText,
}));

const SectionContainer = tw.div`px-5 flex flex-row flex-wrap mx-auto w-full max-w-7xl`;
const Block = tw.div`w-full md:w-1/2 mb-8`;
const LeftBlock = tw(
  Block
)`border-b md:border-r md:border-b-0 pb-8 mb-8 md:pb-0 md:mb-0 border-gray-200 md:pr-4`;
const RightBlock = tw(Block)`md:pl-4`;
const BlockHeader = styled.h2(({ meta }) => ({
  ...tw`text-xl font-bold mb-5`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockHeader,
}));
const BlockDek = styled.p(({ meta }) => ({
  ...tw`text-base mb-3`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockDek,
}));
const BlockCTA = styled.a(({ meta }) => ({
  ...tw`text-base font-bold cursor-pointer`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockCTA,
  color: Colors[meta.color].CTABackground,
}));
const DonateBlockCTA = styled.a(({ meta }) => ({
  ...tw`inline-flex text-base font-bold cursor-pointer items-center px-5`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockCTA,
  color: Colors[meta.color].CTAText,
  backgroundColor: Colors[meta.color].CTABackground,
}));

export default function HomepagePromoBar({ metadata }) {
  return (
    <SectionLayout meta={metadata}>
      <SectionContainer>
        <LeftBlock>
          <BlockHeader meta={metadata}>{metadata.aboutHed}</BlockHeader>
          <BlockDek meta={metadata}>{metadata.aboutDek}</BlockDek>
          <Link href="/about">
            <BlockCTA meta={metadata}>{metadata.aboutCTA}</BlockCTA>
          </Link>
        </LeftBlock>
        <RightBlock>
          <BlockHeader meta={metadata}>{metadata.supportHed}</BlockHeader>
          <BlockDek meta={metadata}>{metadata.supportDek}</BlockDek>
          <DonateBlockCTA
            style={{
              minHeight: '2.375rem',
            }}
            meta={metadata}
          >
            {metadata.supportCTA}
          </DonateBlockCTA>
        </RightBlock>
      </SectionContainer>
    </SectionLayout>
  );
}
