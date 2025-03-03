'use client';

import * as Dialog from '@radix-ui/react-dialog';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {usePlausible} from 'next-plausible';
import {cloneElement, useCallback, useEffect, useState} from 'react';

import {CurtainContent, CurtainTitle} from '@lib/components/Curtain';
import {IconChevron} from '@lib/components/icons/IconChevron';
import {LinkOrDiv} from '@lib/components/LinkOrDiv';
import {cl} from '@lib/utils/helpers';
import {PLAUSIBLE_EVENTS} from '@lib/utils/plausible';

import type {ReactElement} from 'react';

export type TSideMenuItem = {
	href: string;
	label: string;
	icon: ReactElement;
	isDisabled?: boolean;
	subMenu?: TSideMenuItem[];
};
type TNavItemProps = {
	label: string;
	href: string;
	icon: ReactElement;
	isSelected: boolean;
	hasSubmenu: boolean;
	isDisabled?: boolean;
	onClick?: () => void;
};
function NavItem({
	label,
	href,
	icon,
	onClick,
	isSelected,
	hasSubmenu,
	isDisabled = false
}: TNavItemProps): ReactElement {
	return (
		<motion.li className={'relative z-10 px-4 md:px-2 lg:px-4'}>
			<LinkOrDiv
				href={hasSubmenu ? href : href}
				isDisabled={isDisabled}
				onClick={onClick}>
				<div
					className={cl(
						'flex items-center gap-2 justify-between rounded-3xl px-4 py-2 transition-colors w-full',
						'group',
						isSelected ? 'bg-neutral-300' : isDisabled ? '' : 'hover:bg-neutral-300',
						isDisabled ? 'cursor-not-allowed' : ''
					)}>
					<div className={'flex items-center gap-2 text-neutral-600'}>
						{cloneElement(icon, {
							className: cl(
								(icon.props as any).className,
								'h-4 w-4',
								isSelected
									? 'text-neutral-900 text-neutral-600'
									: isDisabled
										? 'text-neutral-400'
										: 'group-hover:text-neutral-900'
							)
						} as any)}
						<p
							className={cl(
								'transition-colors',
								isSelected
									? 'text-neutral-900'
									: isDisabled
										? 'text-neutral-400'
										: 'group-hover:text-neutral-900'
							)}>
							{label}
						</p>
					</div>
					{isDisabled && (
						<span className={'rounded-full bg-[#FFF3D3] px-2.5 py-0.5 text-center text-xxs text-[#FF9900]'}>
							{'Soon'}
						</span>
					)}
					{hasSubmenu && (
						<span>
							<IconChevron className={'size-3 text-neutral-600'} />
						</span>
					)}
				</div>
			</LinkOrDiv>
		</motion.li>
	);
}

export function SideMenuNav(props: {menu?: TSideMenuItem[]; onClose?: () => void}): ReactElement {
	const plausible = usePlausible();
	const pathname = usePathname();
	const [subMenu, setSubMenu] = useState<TSideMenuItem[] | undefined>(undefined);

	/**********************************************************************************************
	 ** Onmount, check if the current path is a submenu. If so, set the submenu to that submenu.
	 *********************************************************************************************/
	useEffect(() => {
		const subMenu = (props.menu || []).find(({subMenu}) => subMenu?.some(({href}) => pathname?.startsWith(href)));
		if (subMenu) {
			setSubMenu(subMenu.subMenu);
		}
	}, [pathname, props.menu]);

	/**********************************************************************************************
	 ** This function is used to handle the click event on the navigation menu. In most case, this
	 ** will be used to combine a page change with the close of the menu (mobile). But when a
	 ** submenu is present, this will open that submenu.
	 *********************************************************************************************/
	const onNavClick = useCallback(
		(subMenu?: TSideMenuItem[]) => {
			if (subMenu && subMenu.length > 0) {
				setSubMenu(subMenu);
			} else if (props.onClose) {
				props.onClose();
			}
		},
		[props]
	);

	return (
		<div className={'scrollable scrollbar-show h-full'}>
			<section className={'relative flex h-full flex-col justify-between overflow-hidden pt-4'}>
				<Dialog.Root
					modal={false}
					open={Boolean(subMenu)}>
					<ul className={'grid gap-2 pb-8'}>
						{(props.menu || []).map(({href, label, icon, subMenu, isDisabled}) => (
							<NavItem
								key={href}
								href={href}
								label={label}
								icon={icon}
								isDisabled={isDisabled}
								hasSubmenu={Boolean(subMenu && subMenu.length > 0)}
								isSelected={pathname?.startsWith(href) ?? false}
								onClick={() => onNavClick(subMenu)}
							/>
						))}
					</ul>
					<div className={'mt-auto px-4'}>
						<div className={'flex justify-between pb-2 pt-6 text-xxs text-neutral-600'}>
							<div className={'flex gap-4'}>
								<Link
									onClick={() => plausible(PLAUSIBLE_EVENTS.NAVIGATE_TO_GITHUB)}
									className={'transition-colors hover:text-neutral-900'}
									href={'https://github.com/SmolDapp'}
									target={'_blank'}>
									{'GitHub'}
								</Link>
								<Link
									onClick={() => plausible(PLAUSIBLE_EVENTS.NAVIGATE_TO_TWITTER)}
									className={'transition-colors hover:text-neutral-900'}
									href={'https://twitter.com/smoldapp'}
									target={'_blank'}>
									{'Twitter'}
								</Link>
							</div>
						</div>
					</div>

					<CurtainContent onInteractOutside={e => e.preventDefault()}>
						<aside className={'flex h-full flex-col bg-neutral-0'}>
							<div className={'scrollable text-neutral-600'}>
								<ul className={'grid gap-2 pb-8 pt-4'}>
									<div className={'px-4 pb-4 text-xs'}>
										<button
											onClick={() => setSubMenu(undefined)}
											className={
												'flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-900'
											}>
											<IconChevron className={'size-3 !rotate-180'} />
											<CurtainTitle>{'Back'}</CurtainTitle>
										</button>
									</div>
									{(subMenu || []).map(({href, label, icon}) => (
										<NavItem
											key={href}
											href={href}
											label={label}
											icon={icon}
											isDisabled={false}
											hasSubmenu={false}
											isSelected={pathname?.startsWith(href) ?? false}
											onClick={props.onClose}
										/>
									))}
								</ul>
							</div>
						</aside>
					</CurtainContent>
				</Dialog.Root>
			</section>
		</div>
	);
}
