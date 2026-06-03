import java.sql.*;

public class TransactionDemo {

    public static void main(String[] args)
            throws Exception {

        Connection con =
                DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/bank",
                        "root",
                        "password");

        try {

            con.setAutoCommit(false);

            PreparedStatement debit =
                    con.prepareStatement(
                            "update accounts set balance=balance-500 where id=1");

            PreparedStatement credit =
                    con.prepareStatement(
                            "update accounts set balance=balance+500 where id=2");

            debit.executeUpdate();
            credit.executeUpdate();

            con.commit();

            System.out.println("Transfer Success");
        }
        catch(Exception e) {

            con.rollback();

            System.out.println("Transfer Failed");
        }
    }
}