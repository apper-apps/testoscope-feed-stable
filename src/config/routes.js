import Upload from '@/components/pages/Upload'
import Input from '@/components/pages/Input'
import Analysis from '@/components/pages/Analysis'

export const routes = {
  upload: {
    id: 'upload',
    label: 'Upload',
    path: '/',
    icon: 'Upload',
    component: Upload,
    step: 1
  },
  input: {
    id: 'input',
    label: 'Input',
    path: '/input',
    icon: 'FileText',
    component: Input,
    step: 2
  },
  analysis: {
    id: 'analysis',
    label: 'Analysis',
    path: '/analysis',
    icon: 'Activity',
    component: Analysis,
    step: 3
  }
}

export const routeArray = Object.values(routes)
export default routes