
import { useState, useEffect } from "react"
import { ArrowLeft, Clock, CheckCircle, Send, Globe, Phone } from "lucide-react"
import { toast } from "react-toastify"
import { getCountries, getCountryCallingCode } from "react-phone-number-input"
import en from "react-phone-number-input/locale/en.json"

const PhoneVerification = () => {
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isChangingPhone, setIsChangingPhone] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [newSelectedCountry, setNewSelectedCountry] = useState("US")
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNewDropdownOpen, setIsNewDropdownOpen] = useState(false)

  const countries = getCountries()
  const popularCountries = ["US", "GB", "CA", "AU", "DE", "FR", "IN", "CN", "JP", "BR"]

  useEffect(() => {
    const lastSent = localStorage.getItem("phoneOtpSentTime")
    if (lastSent) {
      const timeDiff = Date.now() - Number.parseInt(lastSent)
      const remainingTime = 60000 - timeDiff
      if (remainingTime > 0) {
        setCanResend(false)
        setCountdown(Math.ceil(remainingTime / 1000))
      }
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const formatPhoneNumber = (value, countryCode) => {
    const phoneNumber = value.replace(/[^\d]/g, "")
    if (countryCode === "US" || countryCode === "CA") {
      const phoneNumberLength = phoneNumber.length
      if (phoneNumberLength < 4) return phoneNumber
      if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
      }
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
    return phoneNumber
  }

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value, selectedCountry)
    setPhoneNumber(formattedPhone)
  }

  const handleNewPhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value, newSelectedCountry)
    setNewPhoneNumber(formattedPhone)
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`phone-otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`phone-otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/[^\d]/g, "").slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
  }

  const handleSendOtp = async () => {
    const cleanPhone = phoneNumber.replace(/[^\d]/g, "")
    if (!phoneNumber || cleanPhone.length < 7) {
      toast.error("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    localStorage.setItem("phoneOtpSentTime", Date.now().toString())
    setCanResend(false)
    setCountdown(60)
    setIsOtpSent(true)
    setIsLoading(false)
    toast.success("OTP sent to your phone!")
  }

  const handleVerifyPhone = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      toast.error("Please enter complete 6-digit code")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (otpCode === "123456") {
      toast.success("Phone number verified successfully!")
    } else {
      toast.error("Invalid verification code")
    }
    setIsLoading(false)
  }

  const handleChangePhone = async () => {
    const cleanPhone = newPhoneNumber.replace(/[^\d]/g, "")
    if (!newPhoneNumber || cleanPhone.length < 7) {
      toast.error("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setPhoneNumber(newPhoneNumber)
    setSelectedCountry(newSelectedCountry)
    setNewPhoneNumber("")
    setIsChangingPhone(false)
    setOtp(["", "", "", "", "", ""])
    setIsOtpSent(true)
    await handleSendOtp()
  }

  const CountrySelector = ({ selectedCountry, onCountryChange, isOpen, setIsOpen }) => {
    const sortedCountries = [
      ...popularCountries.filter((country) => countries.includes(country)),
      ...countries.filter((country) => !popularCountries.includes(country)),
    ]

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-3 bg-input border border-border rounded-l-lg hover:bg-input/80 transition-colors focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm">+{getCountryCallingCode(selectedCountry)}</span>
          <span className="text-xs opacity-60">{selectedCountry}</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 w-80 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-border">
              <p className="text-xs text-muted-foreground font-medium">Popular Countries</p>
            </div>
            {popularCountries
              .filter((country) => countries.includes(country))
              .map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    onCountryChange(country)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent text-left transition-colors"
                >
                  <span className="font-mono text-sm min-w-[3rem]">+{getCountryCallingCode(country)}</span>
                  <span className="text-sm">{en[country] || country}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{country}</span>
                </button>
              ))}
            <div className="p-2 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">All Countries</p>
            </div>
            {countries
              .filter((country) => !popularCountries.includes(country))
              .map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    onCountryChange(country)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent text-left transition-colors"
                >
                  <span className="font-mono text-sm min-w-[3rem]">+{getCountryCallingCode(country)}</span>
                  <span className="text-sm">{en[country] || country}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{country}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
              <Phone className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Phone</h1>
            <p className="text-muted-foreground">
              {isOtpSent ? "Enter the code sent to" : "Enter your phone number to receive a verification code"}
            </p>
            {isOtpSent && (
              <p className="text-secondary font-semibold mt-2">
                +{getCountryCallingCode(selectedCountry)} {phoneNumber}
              </p>
            )}
          </div>

          {!isChangingPhone ? (
            <>
              {!isOtpSent ? (
                <>
                  {/* Phone Number Input with Country Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <div className="flex relative">
                      <CountrySelector
                        selectedCountry={selectedCountry}
                        onCountryChange={setSelectedCountry}
                        isOpen={isDropdownOpen}
                        setIsOpen={setIsDropdownOpen}
                      />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter your phone number"
                        className="flex-1 px-4 py-3 bg-input border border-l-0 border-border rounded-r-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Send OTP Button */}
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading || !phoneNumber}
                    className="w-full bg-secondary hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">Enter verification code</label>
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`phone-otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          maxLength={1}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyPhone}
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {isLoading ? "Verifying..." : "Verify Phone Number"}
                  </button>

                  {/* Resend OTP */}
                  <div className="text-center mb-4">
                    {canResend ? (
                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="text-secondary hover:text-secondary/80 font-medium transition-colors"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Resend in {countdown}s</span>
                      </div>
                    )}
                  </div>

                  {/* Change Phone */}
                  <div className="text-center">
                    <button
                      onClick={() => setIsChangingPhone(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Change Phone Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">New Phone Number</label>
                <div className="flex relative">
                  <CountrySelector
                    selectedCountry={newSelectedCountry}
                    onCountryChange={setNewSelectedCountry}
                    isOpen={isNewDropdownOpen}
                    setIsOpen={setIsNewDropdownOpen}
                  />
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={handleNewPhoneChange}
                    placeholder="Enter new phone number"
                    className="flex-1 px-4 py-3 bg-input border border-l-0 border-border rounded-r-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsChangingPhone(false)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleChangePhone}
                  disabled={isLoading}
                  className="flex-1 bg-secondary hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  {isLoading ? "Updating..." : "Update Phone"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhoneVerification