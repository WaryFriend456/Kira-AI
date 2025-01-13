import React from 'react'
import Mail from './mail'
const MailPage = () => {
    return (
        <Mail
        defaultLayout={[20, 32, 48]}
        navCollapsedSize={4}
        defaultCollapsed={false}
        />
    )
}

export default MailPage