import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | TaskOrbit",
  description:
    "Read the terms for using the TaskOrbit project management platform.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms apply when you access or use the TaskOrbit platform."
    >
      <section>
        <h2>Using TaskOrbit</h2>
        <p>
          TaskOrbit provides tools for project management and team
          collaboration. Your access to features depends on your account, role,
          and workspace. You agree to use the platform only for lawful purposes
          and in accordance with these terms and any applicable workspace rules.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <p>
          Keep your sign-in credentials secure and provide accurate information
          when creating or maintaining an account. You are responsible for
          activity carried out through your account. Notify your administrator
          if you believe your account has been accessed without permission.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You must not:</p>
        <ul className="mt-3">
          <li>
            Use the platform to violate any law or another person&apos;s rights.
          </li>
          <li>
            Attempt to access accounts, records, or areas you are not authorized
            to use.
          </li>
          <li>
            Interfere with the platform, its security, or other users&apos;
            access.
          </li>
          <li>
            Upload content that is unlawful, harmful, or that you do not have
            permission to share.
          </li>
        </ul>
      </section>

      <section>
        <h2>Workspace content and permissions</h2>
        <p>
          You retain responsibility for content you submit. You confirm that you
          have the rights and permissions needed to provide it. You give
          TaskOrbit permission to host and display that content only as needed
          to operate the platform and make its features available to authorized
          users.
        </p>
      </section>

      <section>
        <h2>Payments</h2>
        <p>
          Where a plan or feature requires payment, the applicable amount and
          currency are presented during checkout. Payment processing is provided
          by the selected third-party payment provider and is subject to that
          provider&apos;s terms. TaskOrbit records payment status and
          transaction details. Questions about a charge or refund should be
          directed to the administrator or payment provider responsible for it.
        </p>
      </section>

      <section>
        <h2>Availability and changes</h2>
        <p>
          Features may change over time, and the platform may occasionally be
          unavailable for maintenance or other reasons. We do not guarantee
          uninterrupted availability. We may update these terms when the service
          or its requirements change; the current version will be published on
          this page.
        </p>
      </section>

      <section>
        <h2>Suspension or termination</h2>
        <p>
          Access may be restricted or suspended when necessary to protect the
          platform, its users, or a workspace, or when these terms are violated.
          Contact your administrator about account access or role-related
          decisions.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For questions about your account or use of TaskOrbit, contact the
          administrator responsible for your account.
        </p>
      </section>
    </LegalPage>
  );
}
