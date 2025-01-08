import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import PalyVedio from "../Components/HowToPlay/PalyVedio";

function CoomingSoon() {
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const [plays, setPlays] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date("January 27, 2025 23:59:59").getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const validationSchema = Yup.object({
    emailOrPhone: Yup.string()
      .required("This field is required")
      .test(
        "is-email-or-phone",
        "Please enter a valid email or phone number",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^[6-9]\d{9}$/; // Validates Indian mobile numbers without country code
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      )
      .test(
        "add-country-code",
        "Phone number should include +91 country code",
        (value) => {
          const phoneRegex = /^[6-9]\d{9}$/;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // Allow emails or phone numbers with country code
          if (emailRegex.test(value)) return true; // Pass for valid emails
          if (value.startsWith("+91") || phoneRegex.test(value)) return true; // Pass for phone with code or valid format
          return false; // Fail otherwise
        }
      ),
  });

  const Subscribe = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "v1/admin/subscriber/add-subscriber",
        values
      );
      Swal.fire({
        icon: "success",
        text: response.data.message || "Subscription successful!",
      });

      resetForm(); // Reset form fields after success
    } catch (error) {
      Swal.fire({
        icon: "error",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  const openVideo = () => setPlays(true);

  const closeVideo = () => {
    setPlays(false);
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  return (
    <>
      <div className="comming-soon">
        <img
          className="batsmenshape"
          src={`${process.env.PUBLIC_URL}/images/aaa.png`}
          //   src="images1/aaa.png"
        />
        <img
          className="batsmenshape shape1"
          src={`${process.env.PUBLIC_URL}/images/cricket-match-with-player.png`}
          //   src="images1/cricket-match-with-player.png"
        />
        <div className="comming-soon-info">
          <div className="comming-soon-inner">
            {/* Logo Start */}
            <div className="logo">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                //   src="images1/logo.png"
                alt="Logo"
              />
            </div>
            {/* Logo end */}
            <div className="site-info">
              <h2>
                {" "}
                <span>Coming Soon </span>
              </h2>
              <h3>
                <span>January 27, 2025</span>
              </h3>
            </div>
            {/* Countdown Start */}
            <div className="countdown-timer-wrapper">
              {/* <div className="countheading_endsin">
                <h2>Countdown to Launch</h2>
              </div> */}
              <div className="timer" id="countdown">
                <div className="timer-wrapper">
                  <div className="time">{timeLeft.days}</div>
                  <span className="text">Days</span>
                </div>
                <div className="timer-wrapper">
                  <div className="time">{timeLeft.hours}</div>
                  <span className="text">Hours</span>
                </div>
                <div className="timer-wrapper">
                  <div className="time">{timeLeft.minutes}</div>
                  <span className="text">Minutes</span>
                </div>
                <div className="timer-wrapper">
                  <div className="time">{timeLeft.seconds}</div>
                  <span className="text">Seconds</span>
                </div>
              </div>
            </div>
            {/* Countdown end */}
            {/* <div className="site-info">
              <h2>
                An Easy-To-Play Online Cricket Game, With A Weekly Jackpot Prize
                of ₹50,000!
              </h2>
            </div> */}
            <div>
              <h3 className="title">
                An Easy-To-Play Online Cricket Game, With A Weekly Jackpot Prize
                of ₹50,000!{" "}
              </h3>
            </div>
            {/* Contact Form start */}
            <div className="contact-form">
              <div className="contact-box">
                <button
                  type="button"
                  className="bannerfixedbtn howtoplay"
                  id="howtoplay_showonclick"
                  onClick={openVideo}
                >
                  <i className="fa fa-play" aria-hidden="true" /> How to Play
                </button>
                <h2 className="title mt-4">
                  Opt-in For Contest News and Gameplay Updates
                </h2>
                <Formik
                  initialValues={{ emailOrPhone: "" }}
                  validationSchema={validationSchema}
                  onSubmit={Subscribe}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="row">
                        <div className="col-md-12 col-sm-12">
                          <Field
                            name="emailOrPhone"
                            type="text"
                            className="form-control"
                            placeholder="Enter Your Email or Phone Number"
                            style={{ marginBottom: 10 }}
                          />
                        </div>
                        <div className="col-md-12 col-sm-12">
                          <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                          >
                            Submit
                          </button>
                        </div>
                        <ErrorMessage
                          name="emailOrPhone"
                          component="div"
                          className="text-danger"
                          style={{ marginTop: -5 }}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>

      {plays && <PalyVedio isON={plays} isOFF={closeVideo} />}
    </>
  );
}

export default CoomingSoon;
