import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { NaturalLanguageGoal } from "../components/NaturalLanguageGoal";
import { completeOnboarding } from "../api/calendar";
import { useAuth } from "../context/AuthContext";

// First-run experience: instead of an empty dashboard, ask what the user is
// working on and let the AI build everything from one sentence.
export default function Onboarding() {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  async function finish() {
    await completeOnboarding();
    await refresh();
    navigate("/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4">
      <Card className="w-full max-w-lg space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Welcome to Momentum AI</h1>
          <p className="text-sm text-slate-500">
            What are you currently working on? Describe it naturally and your
            assistant will plan, schedule and de-risk it instantly.
          </p>
        </div>
        <NaturalLanguageGoal onDone={() => {}} />
        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={finish}>
            Skip for now
          </Button>
          <Button onClick={finish}>Go to dashboard</Button>
        </div>
      </Card>
    </div>
  );
}