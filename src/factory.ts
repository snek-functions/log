import {makeFn} from '@snek-at/functions'

export const url = process.env.IS_OFFLINE
  ? process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-5000.githubpreview.dev/graphql`
    : 'http://localhost:4000/graphql'
  : process.env.ENDPOINT_URL_LOG || process.env.GATSBY_ENDPOINT_URL_LOG || ''

export const fn = makeFn({
  url
})

// SPDX-License-Identifier: (EUPL-1.2)
// Copyright © 2019-2022 snek.at
