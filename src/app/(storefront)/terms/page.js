import Card from '../../../components/ui/Card'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <Card className="prose max-w-none">
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Brick Apparel website and services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
              using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on Brick Apparel's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this 
              license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Products and Pricing</h2>
            <p>
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product 
              descriptions, images, or other content on the website is accurate, complete, reliable, current, or error-free.
            </p>
            <p className="mt-4">
              All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. 
              In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Payment</h2>
            <p>
              When you place an order, you are making an offer to purchase products at the prices stated. We reserve the right to 
              accept or reject your order for any reason, including product availability, errors in pricing, or suspected fraud.
            </p>
            <p className="mt-4">
              Payment must be received before we ship your order. We accept major credit cards and PayPal. All payments are 
              processed securely through our payment processors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <p>
              Shipping costs and delivery times are provided at checkout. We are not responsible for delays caused by shipping 
              carriers or customs. Risk of loss and title for products pass to you upon delivery to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p>
              Please review our Returns Policy for detailed information about returns and refunds. Items must be returned in their 
              original condition within the specified return period. We reserve the right to refuse returns that do not meet our 
              return policy requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur 
              under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide accurate and complete information when creating an account</li>
              <li>Keep your account information up to date</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Uses</h2>
            <p>You agree not to use the website:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any malicious code or viruses</li>
              <li>To attempt to gain unauthorized access to any portion of the website</li>
              <li>To collect or harvest personal information about other users</li>
              <li>To impersonate any person or entity</li>
              <li>To interfere with or disrupt the website or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of Brick Apparel 
              or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer</h2>
            <p>
              THE MATERIALS ON BRICK APPAREL'S WEBSITE ARE PROVIDED ON AN 'AS IS' BASIS. BRICK APPAREL MAKES NO WARRANTIES, 
              EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED 
              WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL 
              PROPERTY OR OTHER VIOLATION OF RIGHTS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL BRICK APPAREL OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES 
              FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE MATERIALS 
              ON BRICK APPAREL'S WEBSITE, EVEN IF BRICK APPAREL OR A BRICK APPAREL AUTHORIZED REPRESENTATIVE HAS BEEN NOTIFIED ORALLY 
              OR IN WRITING OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you 
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by 
              posting the new Terms of Service on this page and updating the "Last updated" date. Your continued use of the website 
              after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@brickapparel.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </section>
        </div>
      </Card>
    </div>
  )
}

