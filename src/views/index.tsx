import React from 'react'
import { hot } from 'react-hot-loader/root'
import loadable, { LoadableComponent } from '@loadable/component'
import { GlobalLoading } from '../components'

const views: { [key: string]: LoadableComponent<{}> } = {}

const context = require.context('./', true, /View\.tsx?$/, 'lazy')

for (const path of context.keys()) {
  views[path.replace('./', '').replace(/\/View.tsx$/, '')] = hot(loadable(() => context(path), { fallback: <GlobalLoading /> }))
}

export default views
