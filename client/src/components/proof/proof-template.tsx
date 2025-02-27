import { Worker } from "@shared/schema";
import { format } from "date-fns";

interface ProofTemplateProps {
  worker: Worker;
}

export default function ProofTemplate({ worker }: ProofTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">PROOF OF EMPLOYMENT</h1>
        <p className="text-gray-600">WorkforceHub, Inc.</p>
      </div>

      <div className="space-y-6">
        <p>
          This letter confirms that {worker.name} {worker.lastname} is currently
          employed at WorkforceHub, Inc. in the position of {worker.role} within
          our {worker.department} department.
        </p>

        <div className="space-y-2">
          <h2 className="font-bold">Employee Information:</h2>
          <p>Name: {worker.name} {worker.lastname}</p>
          <p>Department: {worker.department}</p>
          <p>Position: {worker.role}</p>
        </div>

        <div className="mt-12">
          <p>This document was generated on {format(new Date(), "MMMM dd, yyyy")}.</p>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="text-center">
            <div className="h-12 mb-2">
              {/* Signature placeholder */}
            </div>
            <p className="font-bold">Human Resources Manager</p>
            <p>WorkforceHub, Inc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
