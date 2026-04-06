import React, { useState } from 'react'
import Button from './Ui/Button'

const Contact = () => {
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [message, setMessage] = useState('')
 const [status, setStatus] = useState(null)

 const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

 const handleSubmit = (e) => {
   e.preventDefault()
   if (!name.trim() || !email.trim() || !message.trim()) {
     setStatus({ type: 'error', text: 'Please fill in all fields.' })
     return
   }
   if (!validateEmail(email)) {
     setStatus({ type: 'error', text: 'Please enter a valid email address.' })
     return
   }

   // Simulate successful submit (replace with real API call if available)
   setStatus({ type: 'success', text: 'Message sent successfully.' })
   setName('')
   setEmail('')
   setMessage('')
 }

 return (
   <section className="w-full bg-[#FDFDFD]">
     <div className="w-full px-4 md:px-8 lg:px-16 py-20">
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

       {/* MAP */}
       <div className="w-full h-[480px] rounded-xl overflow-hidden">
         <iframe
           src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1735198.712217292!2d72.37346554189791!3d31.850582920923316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1ssultanabad%20main%20road!5e0!3m2!1sen!2s!4v1769589090454!5m2!1sen!2s"
           className="w-full h-full rounded-lg"
           style={{ border: 0 }}
           allowFullScreen
           loading="lazy"
           referrerPolicy="no-referrer-when-downgrade"
         ></iframe>
       </div>

      {/* CONTACT FORM */}
      <div className="flex flex-col justify-center h-[480px]">
        <div className="ml-auto w-full pr-0">
           <p className="text-[26px] text-[#4E575A] mb-2">Contact Us</p>
           <h2 className="text-3xl font-bold text-[#F59115] mb-4">Sultanabad Main Road</h2>
           <p className="text-[#4E575A] mb-4 text-sm">
             Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document.
           </p>

           <form className="space-y-2" onSubmit={handleSubmit} noValidate>
             <label htmlFor="contact-name" className="sr-only">Name</label>
             <input
               id="contact-name"
               type="text"
               placeholder="Enter Your Name"
               className="w-full border border-gray-200 px-3 py-2 rounded-md outline-none bg-white text-sm"
               value={name}
               onChange={(e) => setName(e.target.value)}
             />

             <label htmlFor="contact-email" className="sr-only">Email</label>
             <input
               id="contact-email"
               type="email"
               placeholder="Enter Your Email"
               className="w-full border border-gray-200 px-3 py-2 rounded-md outline-none bg-white text-sm"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />

             <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">Message</label>
             <textarea
               id="contact-message"
               placeholder="Message"
               rows="3"
               className="w-full border border-gray-200 px-3 py-2 rounded-md outline-none bg-white resize-none text-sm"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
             ></textarea>

             {status && (
               <p className={`text-xs ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                 {status.text}
               </p>
             )}

             <div className="mt-3 ">
              <button className="bg-[#F59115] hover:bg-[#ff8d01] text-white text-[16px] px-3 py-1 rounded cursor-pointer">
         Submit
       </button>
             </div>
           </form>
         </div>
      </div>
      </div>
    </div>
   </section>
 )
}

export default Contact




