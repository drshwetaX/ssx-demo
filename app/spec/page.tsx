export const dynamic = "force-dynamic";

import Shell from "@/components/Shell";
import DemoProvider from "@/components/DemoProvider";
import SpecView from "@/components/views/SpecView";

export default function Page() {
  return (
    <DemoProvider>
      <Shell>
        <SpecView />
      </Shell>
    </DemoProvider>
  );
}
