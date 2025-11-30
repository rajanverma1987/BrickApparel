import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600">support@brickapparel.com</p>
                <p className="text-gray-600">info@brickapparel.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-secondary-400 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-gray-600">Mon-Fri: 9am - 6pm EST</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                <p className="text-gray-600">123 Fashion Street</p>
                <p className="text-gray-600">New York, NY 10001</p>
                <p className="text-gray-600">United States</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Send us a Message</h2>
          <form className="space-y-4">
            <Input label="Your Name" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="Subject" name="subject" required />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">How can I track my order?</h3>
            <p className="text-gray-600">
              Once your order ships, you'll receive a tracking number via email. You can also track your order from your account page.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">What is your return policy?</h3>
            <p className="text-gray-600">
              We offer a 30-day return policy on all items. Items must be unworn, unwashed, and in original packaging with tags attached.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Do you ship internationally?</h3>
            <p className="text-gray-600">
              Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

