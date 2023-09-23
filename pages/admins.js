import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function AdminsPage({swal}){
    const [email, setEmail] = useState('');
    const [adminEmails, setAdminEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    function addAdmin(ev){
        ev.preventDefault();
        axios.post('/api/admins', {email}).then(res => {
            console.log(res.data);
            swal.fire({
                title: 'Admin created!',
                icon: 'success',
                
            })
            setEmail('');
            loadAdmins();
        }).catch(err => {
            swal.fire({
                title: 'Error!',
                text: err.response.data.message,
                icon: 'error',
                
            })
        });
    }

    function loadAdmins(){
        setIsLoading(true);
        axios.get('/api/admins').then(res => {
            setAdminEmails(res.data);
            setIsLoading(false);
        });
    }

    function deleteAdmin(_id, email){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete admin${email}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                axios.delete('/api/admins?_id='+_id).then(() => {
                    swal.fire({
                    title: 'Admin deleted!',
                    icon: 'success',
                });
            loadAdmins();
            })
         }
        })  
    }

    useEffect(() => {
        loadAdmins();
    }, [])

    return (
        <Layout>
            <h1>Admins</h1>
            <h2>Add new admin</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        className="mb-0" 
                        onChange={ev => setEmail(ev.target.value)}
                        placeholder="google email"> 
                    </input>
                    <button 
                        type="submit"
                        className="btn-primary py-1 whitespace-nowrap">
                        Add admin
                    </button>
                </div>
            </form>
            <h2>Existing admins</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Admin google email</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className="py-4">
                                    <Spinner></Spinner>
                                </div>
                            </td>
                        </tr>
                    )}
                    {adminEmails.length > 0 && adminEmails.map(adminEmail => (
                        <tr>
                            <td>{adminEmail.email}</td>
                            <td>
                                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                            </td>
                            <td>
                                <button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="btn-red">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({swal}) => (
    <AdminsPage swal={swal}></AdminsPage>
));

