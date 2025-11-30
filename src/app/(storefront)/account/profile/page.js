import Link from 'next/link'
import Card from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import Button from '../../../../components/ui/Button'

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link href="/account">
          <button className="text-primary-600 hover:text-primary-800">Back to Account</button>
        </Link>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" />
            <Input label="Last Name" name="lastName" />
          </div>
          <Input label="Email" name="email" type="email" />
          <Input label="Phone" name="phone" type="tel" />
          
          <div className="pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <form className="space-y-4">
          <Input label="Current Password" name="currentPassword" type="password" />
          <Input label="New Password" name="newPassword" type="password" />
          <Input label="Confirm New Password" name="confirmPassword" type="password" />
          
          <div className="pt-4">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Card>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> To update your profile, please log in to your account.
        </p>
      </div>
    </div>
  )
}

