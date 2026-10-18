import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | TaskOrbit",
  description:
    "Learn how TaskOrbit handles account, project, and payment information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy describes the information handled by TaskOrbit when you use the project management platform."
    >
      <section>
        <h2>Information we handle</h2>
        <p>
          TaskOrbit handles information needed to provide its project management
          and team collaboration features. Depending on how you use the
          platform, this may include:
        </p>
        <ul className="mt-3">
          <li>Account details such as your name, email, and profile image.</li>
          <li>
            Workspace and project information, such as projects, tasks,
            comments, attachments, and related records.
          </li>
          <li>
            Payment records such as amount, currency, status, payment provider,
            and transaction reference.
          </li>
          <li>
            Information you provide when contacting or using features of the
            platform.
          </li>
        </ul>
      </section>

      <section>
        <h2>How information is used</h2>
        <p>
          Information is used to create and manage accounts, provide project
          management and collaboration features, associate users with their
          workspace, process and record payments, protect the service, and
          respond to support or account requests.
        </p>
      </section>

      <section>
        <h2>Sign-in and payment providers</h2>
        <p>
          If you choose Google sign-in, Google handles its authentication
          process and provides account information needed to sign you in.
          Payments are handled by the payment provider selected during checkout.
          Their own privacy policies and terms also apply to the information
          they process. TaskOrbit receives payment status and transaction
          details needed to maintain your payment history.
        </p>
      </section>

      <section>
        <h2>Cookies and session information</h2>
        <p>
          The platform uses browser storage and/or cookies required to maintain
          your sign-in session and remember interface preferences. Disabling
          these may prevent sign-in or other features from working correctly.
        </p>
      </section>

      <section>
        <h2>Access and sharing</h2>
        <p>
          Information may be visible to authorized workspace members or other
          users as needed for the platform features and permissions associated
          with your account. Service providers may process information to
          provide authentication, hosting, or payment services. Information may
          also be disclosed when required by law or necessary to protect the
          service and its users.
        </p>
      </section>

      <section>
        <h2>Retention and your choices</h2>
        <p>
          Information is retained as needed to provide the service, maintain
          account and payment records, meet applicable obligations, and support
          the workspace&apos;s use of the platform. For requests to access,
          correct, or delete account information, contact the administrator
          responsible for your account.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          This policy may be updated as the platform changes. The latest version
          and its update date will be published on this page.
        </p>
      </section>
    </LegalPage>
  );
}
