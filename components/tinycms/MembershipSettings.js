import React from 'react';
import tw from 'twin.macro';

const SettingsHeader = tw.h1`text-4xl font-normal leading-normal mt-0 mb-2 text-black`;

export default function MembershipSettings(props) {
  return <SettingsHeader>Membership Settings</SettingsHeader>;
}
