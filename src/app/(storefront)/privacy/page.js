import Card from '../../../components/ui/Card'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <Card className="prose max-w-none">
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to Brick Apparel. We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Register for an account</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="mt-4">This information may include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Account credentials (username, password)</li>
              <li>Order history and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information about your device, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages you visit and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Process and fulfill your orders</li>
              <li>Manage your account and provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (payment processing, shipping, email delivery)</li>
              <li><strong>Business Partners:</strong> Trusted partners who help us operate our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
              the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you 
              do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
              information from children. If you are a parent or guardian and believe your child has provided us with 
              personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
              Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@brickapparel.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </section>
        </div>
      </Card>
    </div>
  )
}

