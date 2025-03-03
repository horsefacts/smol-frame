'use client';

import {sdk as farcaster} from '@farcaster/frame-sdk';
import {Fragment, useEffect} from 'react';
import {useConnect} from 'wagmi';

import type {ReactElement} from 'react';

type TWithFrame = {
	children: ReactElement;
};

function WithFrame({children}: TWithFrame): ReactElement {
	const {connectors, connect} = useConnect();

	useEffect(() => {
		farcaster.actions.ready();
		connect({connector: connectors[0]});
	}, []);

	return <Fragment>{children}</Fragment>;
}

export {WithFrame};
