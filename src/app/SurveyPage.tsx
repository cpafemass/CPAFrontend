import { AppFooter } from '../components/layout/AppFooter'
import { AppHeader } from '../components/layout/AppHeader'
import { SurveyForm } from '../components/survey/SurveyForm'

export function SurveyPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_34rem),linear-gradient(180deg,_#f8fbff,_#eef3f8)] text-slate-900">
      <div className="flex min-h-screen flex-col">
        <AppHeader />

        <SurveyForm />

        <AppFooter />
      </div>
    </div>
  )
}
