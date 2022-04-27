//
//  ExploreViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 01/29/22 - 3/31/22.
//

import UIKit
import MapKit


// ExploreViewController is a UIViewController and a UICollectionViewDelegate,
// since it both provides for a ViewController of the various types of craft-beverages and
// it provides for a segue (a delegate) to the DrinkingEstablishmentCells
class ExploreViewController: UIViewController, UICollectionViewDelegate {

    @IBOutlet weak var collectionView: UICollectionView!
    let manager = ExploreDataManager()
    var selectedCity: LocationItem?
    var headerView: ExploreHeaderView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier! {
        case Segue.locationList.rawValue:
            showLocationList(segue: segue)
        case Segue.establishmentList.rawValue:
            showEstablishmentList(segue: segue)
        default:
            print("Segue not added.")
        }
    }
    
    // Segue check
    override func shouldPerformSegue(withIdentifier identifier: String, sender: Any?) -> Bool {
        if identifier == Segue.establishmentList.rawValue,
           selectedCity == nil {
            showLocationRequiredAction()
            return false
        }
        return true
    }
}

// MARK: Private Extension
private extension ExploreViewController {
    func initialize() {
        manager.fetch()
        setupCollectionView()
    }
    
    // "Beer", "Spirits", "Wine" display properties
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        collectionView.collectionViewLayout = flow
    }
    
    func showLocationList(segue: UIStoryboardSegue) {
        guard let navController = segue.destination as? UINavigationController,
              let viewController = navController.topViewController as? LocationViewController else {
                  return
              }
        viewController.selectedCity = selectedCity
    }
    
    // Establishments cities in the Austin and 10 surrounding areas take the form, e.g., "Fredericksburg, TX"
    func showEstablishmentList(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? DrinkingEstablishmentsListViewController,
           let city = selectedCity,
           let index = collectionView.indexPathsForSelectedItems?.first?.row {
            viewController.selectedTags = manager.exploreItem(at: index).name
            viewController.selectedCity = city
        }
    }
    
    // Flag to ensure user selects a location first before selecting a craft-beverage type
    func showLocationRequiredAction() {
        let alertController = UIAlertController(title: "Location Needed", message: "Please select a location.", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Ok", style: .default, handler: nil)
        alertController.addAction(okAction)
        present(alertController, animated: true, completion: nil)
    }
    
    @IBAction func unwindLocationCancel(segue: UIStoryboardSegue) {
    }
    
    @IBAction func unwindLocationDone(segue: UIStoryboardSegue) {
        if let viewController = segue.source as? LocationViewController {
            selectedCity = viewController.selectedCity
            if let location = selectedCity {
                headerView.locationLabel.text = location.cityAndState
            }
        }
    }
}


// View Control Delegate (segue) layaout for respective Apple devices
extension ExploreViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        var columns: CGFloat = 2
        if Device.isPad || (traitCollection.horizontalSizeClass != .compact) {
            columns = 2
        }
        if Device.isPhone || (traitCollection.horizontalSizeClass != .compact) {
            columns = 1
        }
        let viewWidth = collectionView.frame.size.width
        let inset = 7.0
        let contentWidth = viewWidth - inset * (columns + 1)
        let cellWidth = contentWidth / columns
        let cellHeight = cellWidth
        return CGSize(width: cellWidth, height: cellHeight)
    }

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForHeaderInSection secton: Int) -> CGSize {
        return CGSize(width: collectionView.frame.width, height: 100)
    }
}

// MARK: UICollectionViewDataSource
extension ExploreViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, at indexPath: IndexPath) -> UICollectionReusableView {
        let header = collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: "header", for: indexPath)
        headerView = header as? ExploreHeaderView
        return headerView
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        manager.numberOfExploreItems()  // Number of app panes
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "exploreCell", for: indexPath) as! ExploreCell
        let exploreItem = manager.exploreItem(at: indexPath.row)
        cell.exploreImageView.image = UIImage(named: exploreItem.image!)
        return cell
    }
}
