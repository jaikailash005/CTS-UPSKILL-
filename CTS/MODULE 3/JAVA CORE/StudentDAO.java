import java.sql.*;

public class StudentDAO {

    Connection con;

    StudentDAO() throws Exception {

        con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/studentdb",
                "root",
                "password");
    }

    void insertStudent(int id,String name)
            throws Exception {

        PreparedStatement ps =
                con.prepareStatement(
                        "insert into students values(?,?)");

        ps.setInt(1,id);
        ps.setString(2,name);

        ps.executeUpdate();
    }

    void updateStudent(int id,String name)
            throws Exception {

        PreparedStatement ps =
                con.prepareStatement(
                        "update students set name=? where id=?");

        ps.setString(1,name);
        ps.setInt(2,id);

        ps.executeUpdate();
    }
}