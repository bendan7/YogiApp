import React from 'react'
import Signup from '../pages/Signup'
import UserDashboard from '../pages/UserDashboard'
import Login from '../pages/Login'
import { AuthProvider } from '../contexts/AuthContext'
import { MeetingProvider } from '../contexts/MeetingContext'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from '../pages/ForgotPassword'
import UpdateProfile from '../pages/UpdateProfile'
import PrivateAdminRoute from './PrivateAdminRoute'
import AdminDashboard from '../pages/admin/AdminDashboard'
import Meetings from '../pages/admin/Meetings'

export default function App() {
    const centerImg = {
        width: '25vw',
        maxWidth: '120px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '0.8vh',
        marginTop: '2vh',
    }

    return (
        <div
            className="d-flex align-items-top justify-content-center w-100 p-3"
            style={{ minHeight: '100vh' }}
        >
            <div className="w-100" style={{ maxWidth: '800px' }}>
                <Router>
                    <Link to="/">
                        <img
                            alt="logo"
                            style={centerImg}
                            src={process.env.PUBLIC_URL + '/logo.png'}
                        />
                    </Link>
                    <h3 className="text-center">מערכת ניהול כרטיסיות</h3>
                    <AuthProvider>
                        <MeetingProvider>
                            <Switch>
                                <Route path="/signup" component={Signup} />
                                <Route path="/login" component={Login} />
                                <Route
                                    path="/forgot-password"
                                    component={ForgotPassword}
                                />
                                <Route
                                    path="/update-profile"
                                    component={UpdateProfile}
                                />

                                <PrivateRoute
                                    exact
                                    path="/"
                                    component={UserDashboard}
                                />
                                <PrivateAdminRoute
                                    path="/admin"
                                    component={AdminDashboard}
                                />
                                <PrivateAdminRoute
                                    path="/meetings"
                                    component={Meetings}
                                />
                            </Switch>
                        </MeetingProvider>
                    </AuthProvider>
                </Router>
            </div>
        </div>
    )
}
