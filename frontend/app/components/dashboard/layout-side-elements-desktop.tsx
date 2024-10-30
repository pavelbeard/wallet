import { LayoutLogo } from '@/app/ui/layout-logo';
import React from 'react'
import UserInfo from '../user/user-info';
import SideBar from './side-bar';

type Props = {}

export default function LayoutSideElementsDesktop({}: Props) {
    return (
        <>
          <LayoutLogo />
          <UserInfo />
          <SideBar />
        </>
      );
}