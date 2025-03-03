'use client';

import Link from 'next/link';
import React from 'react';

import {IconAppDisperse, IconAppRevoke} from '@lib/components/icons/IconApps';
import IconMultisafe from '@lib/icons/IconMultisafe';
import {cl} from '@lib/utils/helpers';

import type {ReactElement} from 'react';

type TCutaway = {
	title: ReactElement;
	description: string;
	link: string;
	buttonTitle: string;
	icon: ReactElement;
};

function Cutaway({title, description, link, buttonTitle, icon}: TCutaway): ReactElement {
	return (
		<div className={'flex flex-col justify-between rounded-2xl bg-neutral-200 px-6 py-8 md:h-full'}>
			<div className={'mb-6'}>
				<div className={'mb-3 text-[18px] font-semibold leading-[24px] text-neutral-900'}>{title}</div>
				<div className={'text-sm text-[#ADB1BD]'}>{description}</div>
			</div>
			<Link href={link}>
				<button
					data-variant={'filled'}
					className={cl('button', '!h-10 w-full')}>
					<span className={'mr-2 text-sm'}>{buttonTitle}</span>
					{icon}
				</button>
			</Link>
		</div>
	);
}

export default function Page(): ReactElement {
	return (
		<div className={'calc(h-screen-74px) flex flex-col justify-between'}>
			<div
				className={
					'mb-3 grid grid-cols-1 place-content-center gap-y-6 md:grid-cols-2 md:items-center md:gap-x-6 lg:grid-cols-3'
				}>
				<Cutaway
					title={
						<span>
							{'DID YOU SAY'}
							<br /> {'"DISPERSE?"'}
						</span>
					}
					description={
						'Beloved by projects and individuals, send tokens to multiple addresses at the same time with disperse'
					}
					link={'/disperse'}
					buttonTitle={'Disperse tokens'}
					icon={<IconAppDisperse className={'size-4'} />}
				/>
				<Cutaway
					title={
						<span>
							{'STAY SAFE,'}
							<br /> {'REVOKE!'}
						</span>
					}
					description={'Take control of your contract approvals and check who can spend your tokens'}
					link={'/revoke'}
					buttonTitle={'Revoke allowances'}
					icon={<IconAppRevoke className={'size-4'} />}
				/>
				<Cutaway
					title={
						<span>
							{'ONE SAFE,'}
							<br />
							{'ALL CHAINS'}
						</span>
					}
					description={'Click and clone your Safe on any chain. Easy peasy.'}
					link={'/multisafe'}
					buttonTitle={'Clone my safe'}
					icon={<IconMultisafe className={'size-4'} />}
				/>
			</div>
		</div>
	);
}
