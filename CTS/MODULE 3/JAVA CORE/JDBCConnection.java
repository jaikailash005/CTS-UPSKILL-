import java.sql.*;

public class JDBCConnection {
    public static void main(String[] args) {

        try {
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/studentdb",
                    "root",
                    "password");

            Statement st = con.createStatement();

            ResultSet rs =
                    st.executeQuery("select * from students");

            while(rs.next()) {
                System.out.println(
                        rs.getInt("id") + " " +
                        rs.getString("name"));
            }

            con.close();
        }
        catch(Exception e) {
            System.out.println(e);
        }
    }
}